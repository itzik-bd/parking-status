const isDevMode = process.env.NODE_ENV === 'development';
const prodHost = 'd1x1lhi56k7xsh.cloudfront.net';

interface Environment {
  ws: string;
  host: string;
}

const dev: Environment = {
  ws: 'ws://localhost:1337',
  host: 'localhost:1337',
};

const prod: Environment = {
  ws: `wss://${prodHost}/ws`,
  host: prodHost,
};

export const _environment = {
  isDevMode,
  state: isDevMode ? dev : prod,
};
