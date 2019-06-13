import { Action, createExpressServer } from 'routing-controllers';
import { AuthorizationChecker } from 'routing-controllers/AuthorizationChecker';
import * as jwt from 'jsonwebtoken';

const app = createExpressServer({
    routePrefix: '/v1',
    authorizationChecker: (action: Action, roles: string[]) => {
        const token: string = action.request.headers['authorization'];
        const secret: string = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secret);
        return true;
    }
});

app.listen(3000);
