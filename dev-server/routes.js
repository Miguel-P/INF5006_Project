import taskRoutes from './api/task/task-route.js';
import regRoute from './api/register/register-routes';
import userRoutes from './api/user/user-routes';
import authRoutes from './api/auth/auth-routes';
import constituentRoutes from './api/index_constituent/index_constituent-routes';
import indexRoutes from './api/index/index-routes';

export function registerRoutes(app) {
    app.use('/api', taskRoutes);
    app.use('/api', regRoute);
    app.use('/api', userRoutes);
    app.use('/api', authRoutes);
    app.use('/api', constituentRoutes);
    app.use('/api', indexRoutes);
}
