import csrf from 'csurf';

const csrfProtection = csrf({
  value: (req) => {
    return (
      req.body?._csrf ||
      req.query?._csrf ||
      req.headers['csrf-token'] ||
      req.headers['x-csrf-token'] ||
      req.headers['x-xsrf-token']
    );
  },
});

export default csrfProtection;
