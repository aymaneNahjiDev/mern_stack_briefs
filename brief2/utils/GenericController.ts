// src/controllers/GenericController.ts
import { Router, Request, Response } from 'express';
import { Model, Document } from 'mongoose';

export type HttpMethods = 'POST' | 'GET' | 'PUT' | 'DELETE'

class GenericController<T> {

    private router: Router;

    public model?: Model<T>;
    
    public methods: HttpMethods[] = [
        'DELETE',
        'GET',
        'PUT',
        'POST',
    ];

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        this.initializeRoutes();
        return this.router
    }

    private initializeRoutes() {
        if(this.model){
            if (this.methods.includes('POST'))
                this.router.post('/', this.create);
            if (this.methods.includes('GET'))
                this.router.get('/', this.readAll);
            if (this.methods.includes('GET'))
                this.router.get('/:id', this.readOne);
            if (this.methods.includes('PUT'))
                this.router.put('/:id', this.update);
            if (this.methods.includes('DELETE'))
                this.router.delete('/:id', this.deleteItem);
        }
    }

    private create = async (req: Request, res: Response): Promise<void> => {
        if (!this.model)
            return;
        try {
            const item = new this.model(req.body);
            await item.save();
            res.status(201).json(item);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    };

    private readAll = async (req: Request, res: Response): Promise<void> => {
        if (!this.model)
            return;
        try {
            const items = await this.model.find();
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    };

    private readOne = async (req: Request, res: Response): Promise<void> => {
        if (!this.model)
            return;
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                res.status(404).json({ error: 'Item not found' });
            } else {
                res.status(200).json(item);
            }
        } catch (err) {
            res.status(400).json({ error: err });
        }
    };

    private update = async (req: Request, res: Response): Promise<void> => {
        if (!this.model)
            return;
        try {
            const item = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!item) {
                res.status(404).json({ error: 'Item not found' });
            } else {
                res.status(200).json(item);
            }
        } catch (err) {
            res.status(400).json({ error: err });
        }
    };

    private deleteItem = async (req: Request, res: Response): Promise<void> => {
        if (!this.model)
            return;
        try {
            const item = await this.model.findByIdAndDelete(req.params.id);
            if (!item) {
                res.status(404).json({ error: 'Item not found' });
            } else {
                res.status(200).json({ message: 'Item deleted successfully' });
            }
        } catch (err) {
            res.status(400).json({ error: err });
        }
    };
}

export default GenericController;
