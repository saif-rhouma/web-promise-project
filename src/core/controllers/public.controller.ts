import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import HTTP_CODE from '../constants/httpCode';

class PublicController {
  home: AsyncRouteHandler = async (_req, res) => {
    res.render('home');
  };

  contactPage: AsyncRouteHandler = async (_req, res) => {
    res.render('contact');
  };

  sendContactMessage: AsyncRouteHandler = async (_req, res) => {
    res.status(HTTP_CODE.Ok).json({ message: 'Message sent' });
  };

  listStartups: AsyncRouteHandler = async (_req, res) => {
    const startups = [
      { name: 'Startup A', sector: 'AI' },
      { name: 'Startup B', sector: 'Fintech' },
    ];

    res.status(HTTP_CODE.Ok).json(startups);
  };

  getStartupDetails: AsyncRouteHandler = async (req, res) => {
    res.status(HTTP_CODE.Ok).json({
      slug: req.params.slug,
      name: 'Example Startup',
      jobs: [],
    });
  };
}

export default new PublicController();
