import HttpController, { HttpMethods } from "../utils/an_mern_pack/HttpController";

class TestController extends HttpController {

    public methods: HttpMethods[] = [
        'GET'
    ]
    
    // public async onGet(req: TheRequest, res: Response) {
    //     const hhh = super.onGet(req, res);
    //     console.log('kkkkkkkkkkkkkkkkkkkkkkkk');
        
    //     return hhh
    // }
    // public async onPost(req: TheRequest, res: Response) {
    //     return res.send()
    // }
}

export default new TestController();