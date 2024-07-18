// src/controllers/HttpController.ts
import { Router, Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import * as joi from 'joi'
import { TheRequest } from './types';


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

class HttpController {
    
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

    public methods: HttpMethods[] = [
        'DELETE',
        'GET',
        'PUT',
        'POST',
        'PATCH',
    ];

    public bodyValidations: HttpBodyValidations = {}
    public queryValidations: HttpQueryValidations = {}
    public paramsValidations: HttpParamsValidations = {
        // DELETE:joi.object({
        //     id:joi.number().required()
        // })
    }

    public middlewares : Middlewares = {}

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        this.initializeRoutes();
        return this.router
    }

    private initializeRoutes() {
        const allMiddlewares = this.middlewares.ALL || []
        const safeMiddlewares = this.middlewares.SAFE || []
        const dangerMiddlewares = this.middlewares.DANGER || []
        if (this.methods.includes('POST')){
            const postMiddlewares = this.middlewares.POST || []
            const params = Object.keys(this.paramsValidations.POST?.describe().keys || {}).map(key=>`:${key}`).join('/')

            this.router.post(
                `/${params}`,
                ...allMiddlewares, 
                ...dangerMiddlewares,
                ...postMiddlewares,
                this.getQueryValidationMiddleware('POST'),
                this.getBodyValidationMiddleware('POST'),
                this.getParamsValidationMiddleware('POST'),
                this.onPost
            );
        }
        if (this.methods.includes('GET')){
            const getMiddlewares = this.middlewares.GET || []
            const params = Object.keys(this.paramsValidations.GET?.describe().keys || {}).map(key=>`:${key}`).join('/')

            this.router.get(
                `/${params}`,
                ...allMiddlewares,
                ...safeMiddlewares,
                ...getMiddlewares,
                this.getQueryValidationMiddleware('GET'),
                this.getParamsValidationMiddleware('GET'),
                this.onGet
            );
        }

        if (this.methods.includes('PATCH')){
            const patchMiddlewares = this.middlewares.PATCH || []
            const params = Object.keys(this.paramsValidations.PATCH?.describe().keys || {}).map(key=>`:${key}`).join('/')

            this.router.patch(
                `/${params}`,
                ...allMiddlewares,
                ...dangerMiddlewares,
                ...patchMiddlewares,
                this.getQueryValidationMiddleware('PATCH'),
                this.getBodyValidationMiddleware('PATCH'),
                this.getParamsValidationMiddleware('PATCH'),
                this.onPatch
            );
        }
            
        if (this.methods.includes('DELETE')){
            const deleteMiddlewares = this.middlewares.DELETE || []
            const params = Object.keys(this.paramsValidations.DELETE?.describe().keys || {}).map(key=>`:${key}`).join('/')
            this.router.delete(
                `/${params}`,
                ...allMiddlewares,
                ...dangerMiddlewares,
                ...deleteMiddlewares, 
                this.getQueryValidationMiddleware('DELETE'),
                this.getParamsValidationMiddleware('DELETE'),
                this.onDelete
            );
        }
    }

    public async onPost (req: TheRequest, res: Response) {

        return res.status(201).send();
    };

    public async onGet (req: TheRequest, res: Response) {

        return res.status(200).send();
    };
    public async onPatch (req: TheRequest, res: Response) {

        return res.status(200).send();
    };
    public async onDelete (req: TheRequest, res: Response) {

        return res.status(204).send();
    };
}

export default HttpController;
