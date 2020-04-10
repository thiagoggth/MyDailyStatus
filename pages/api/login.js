import auth0 from '../../lib/auth0';

const login = async (request, response) => {
    await auth0.handleLogin(request, response);
    response.send({ name: 'Thiago Augusto' });
}

//autenticação.
//autorização.

export default login