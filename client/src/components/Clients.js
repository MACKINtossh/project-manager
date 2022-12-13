import { gql, useQuery } from '@apollo/client';
import ClientRow from './ClientRow';

const GET_CLIENTS = gql`
    query getClients {
        clients {
          id
          name
          email 
          phone 
        }
    }
`    


  

export default function Clients() {

  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something Went Wrong</p>;

   

  
  {/* If the page is not loading and there is no error, load the table */}
  return <> { !loading && !error && (
    <table className='table table-hover mt-3'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {/* We loop through the clients, which we get from data.clients and then pass in the ClientRow component with the clientId and client as props */}
              {  
                data.clients.map(client => (
                  <ClientRow key={client.id} client={client} />
                ))}
      </tbody>
    </table>
  ) } </>
    
    
  
  
}


