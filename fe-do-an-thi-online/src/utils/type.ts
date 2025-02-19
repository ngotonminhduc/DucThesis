
interface User {
  token: string;
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface LoginResponse {
  data:{
    token: string;
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }
}
interface RegisterResponse {
  data:{
    user: {
      createdAt: string,
      id: string,
      name: string,
      email: string
    }
  }
}