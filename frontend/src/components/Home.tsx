import { apiCallBody } from "../api/apiHelpers";

const Home = () => {
  return (
    <>
      <div>
        <h1>
          Home
        </h1>
        <button
        onClick={(e) => {
          e.preventDefault();
          const executeAuth = async () => {
            try {
              const redirect_url = await apiCallBody('GET', '/get_auth', undefined);
              window.location.href = redirect_url
            } catch (error) {
              console.log('Error:', error);
            }            
          }
          executeAuth();
        }}>
           Click here for data
        </button>
      </div>
    </>
  );
};

export default Home;