// src/controllers/GenericController.ts
import * as joi from 'joi';
import type { TheRequest } from './types';
import { Router, Response, NextFunction } from 'express';
import { Model, Document, IfAny, Require_id } from 'mongoose';


export type HttpMethods = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type QueryValidationMiddleware = HttpMethods

export type ParamsValidationMiddleware = HttpMethods

export type BodyValidationMiddleware = 'POST' | 'PUT' | 'PATCH'

export type MiddlewaresKey = HttpMethods | 'ALL' | 'SAFE' | 'DANGER'

export type HttpParamsValidations = {
    [key in ParamsValidationMiddleware]?: joi.ObjectSchema;
};

export type HttpQueryValidations = {
    [key in QueryValidationMiddleware]?: joi.ObjectSchema;
};


export type Middlewares = {
    [key in MiddlewaresKey]?: ((req: TheRequest, res: Response, next: NextFunction) => void)[];
};

export type HttpBodyValidations = {
    [key in BodyValidationMiddleware]?: joi.ObjectSchema;
};

class GenericController<T> {

    private router: Router;

    private getBodyValidationMiddleware = (method: BodyValidationMiddleware)=>{
        return (req: TheRequest, res: Response, next: NextFunction) =>{
            const schema = this.bodyValidations[method]
            if(schema){
                const result = schema.validate(req.body)
                if (result?.error){
                    return res.status(400).send({params:result.error.details[0].message})
                }
            }
            next()
        }
    }

    private getQueryValidationMiddleware = (method: QueryValidationMiddleware)=>{
        return (req: TheRequest, res: Response, next: NextFunction) =>{
            const schema = this.queryValidations[method]
            if(schema){
                const result = schema.validate(req.query)
                if (result?.error){
                    return res.status(400).send({params:result.error.details[0].message})
                }
            }
            next()
        
        }
    }

    private getParamsValidationMiddleware = (method: ParamsValidationMiddleware)=>{
        return (req: TheRequest, res: Response, next: NextFunction) =>{
            const schema = this.paramsValidations[method]
            if(schema){
                const result = schema.validate(req.params)
                if (result?.error){
                    return res.status(400).send({params:result.error.details[0].message})
                }
            }
            next()
        }
    }


    // model need crud
    public model?: Model<T>;

    // instance filled in create, update, delete, readOne
    public instance?: IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>;

    //allowed http methods
    public methods: HttpMethods[] = [
        'DELETE',
        'GET',
        'PUT',
        'POST',
        'PATCH',
    ];


    public bodyValidations: HttpBodyValidations = {}
    public queryValidations: HttpQueryValidations = {}
    public paramsValidations: HttpParamsValidations = {}

    public middlewares : Middlewares = {}

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        this.initializeRoutes();
        return this.router
    }

    private initializeRoutes() {
        if (this.model) {
            const allMiddlewares = this.middlewares.ALL || []
            const safeMiddlewares = this.middlewares.SAFE || []
            const dangerMiddlewares = this.middlewares.DANGER || []
            if (this.methods.includes('POST')){
                const postMiddlewares = this.middlewares.POST || []
                this.router.post(
                    '/',
                    ...allMiddlewares, 
                    ...dangerMiddlewares,
                    ...postMiddlewares,
                    this.getQueryValidationMiddleware('POST'),
                    this.getBodyValidationMiddleware('POST'),
                    this.getParamsValidationMiddleware('POST'),
                    this.create
                );
            }
            if (this.methods.includes('GET')){
                const getMiddlewares = this.middlewares.GET || []
                this.router.get(
                    '/',
                    ...allMiddlewares,
                    ...safeMiddlewares,
                    ...getMiddlewares,
                    this.getQueryValidationMiddleware('GET'),
                    this.getParamsValidationMiddleware('GET'),
                    this.readAll
                );
            }
                
            if (this.methods.includes('GET')){
                const getMiddlewares = this.middlewares.GET || []
                this.router.get(
                    '/paginate/',
                    ...allMiddlewares,
                    ...safeMiddlewares,
                    ...getMiddlewares, 
                    this.getQueryValidationMiddleware('GET'),
                    this.getParamsValidationMiddleware('GET'),
                    this.readByPagination
                );
            }
                
            if (this.methods.includes('GET')){
                const getMiddlewares = this.middlewares.GET || []
                this.router.get(
                    '/:id',
                    ...allMiddlewares,
                    ...safeMiddlewares,
                    ...getMiddlewares, 
                    this.getQueryValidationMiddleware('GET'),
                    this.getParamsValidationMiddleware('GET'),
                    this.readOne
                );
            }
                
            if (this.methods.includes('PUT')){
                const putMiddlewares = this.middlewares.PUT || []
                this.router.put(
                    '/:id',
                    ...allMiddlewares,
                    ...dangerMiddlewares,
                    ...putMiddlewares,
                    this.getQueryValidationMiddleware('PUT'),
                    this.getBodyValidationMiddleware('PUT'),
                    this.getParamsValidationMiddleware('PUT'),
                    this.update
                );
            }

            if (this.methods.includes('PATCH')){
                const patchMiddlewares = this.middlewares.PATCH || []
                this.router.patch(
                    '/:id',
                    ...allMiddlewares,
                    ...dangerMiddlewares,
                    ...patchMiddlewares,
                    this.getQueryValidationMiddleware('PATCH'),
                    this.getBodyValidationMiddleware('PATCH'),
                    this.getParamsValidationMiddleware('PATCH'),
                    this.update
                );
            }
                
            if (this.methods.includes('DELETE')){
                const deleteMiddlewares = this.middlewares.DELETE || []
                this.router.delete(
                    '/:id',
                    ...allMiddlewares,
                    ...dangerMiddlewares,
                    ...deleteMiddlewares, 
                    this.getQueryValidationMiddleware('DELETE'),
                    this.getParamsValidationMiddleware('DELETE'),
                    this.deleteItem
                );
            }
                
        }
    }

    public create = async (req: TheRequest, res: Response) =>{
        if (!this.model)
            return;
        try {
            const item = new this.model(req.body);
            await item.save();
            this.instance = item
            return res.status(201).json(item);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    };

    public async readAll(req: TheRequest, res: Response){
        if (!this.model)
            return;
        try {
            const items = await this.model.find();
            return res.status(200).json(items);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    };

    public readByPagination = async(req: TheRequest, res: Response) => {
        const { page = 1, page_size = 10 } = req.query


        if (!this.model)
            return;
        try {

            let index = 0;
            let pageSize = 10;
            if (typeof page_size === 'number' || typeof page_size === 'string')
                try {
                    pageSize = parseInt(page_size.toString(),10);
                } catch { }
            if (typeof page === 'number' || typeof page === 'string')
                try {
                    const p = parseInt(page.toString(),10);
                    index = p > 0 ? p - 1 : 0;
                } catch { }
                

            const items = await this.model.find().skip(index * pageSize).limit(pageSize);
            const nextItemsCount = await this.model.find().skip((index+1) * pageSize).limit(pageSize).countDocuments();
            return res.status(200).json({
                page:items.length ? index + 1 : 1,
                pageSize,
                next:nextItemsCount>0? (index + 1) : null,
                prev:index>0? index : null,
                total_count: await this.model.countDocuments(),
                results:items
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    };

    public readOne = async(req: TheRequest, res: Response)=>{
        if (!this.model)
            return;
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            } else {
                this.instance = item
                return res.status(200).json(item);
            }
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    };

    public update = async(req: TheRequest, res: Response)=>{
        if (!this.model)
            return;
        try {
            const item = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            } else {
                this.instance = item
                return res.status(200).json(item);
            }
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    };

    public deleteItem = async(req: TheRequest, res: Response) => {
        if (!this.model)
            return;
        try {
            const item = await this.model.findByIdAndDelete(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            } else {
                this.instance = item
                return res.status(200).json({ message: 'Item deleted successfully' });
            }
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    };
}

export default GenericController;
