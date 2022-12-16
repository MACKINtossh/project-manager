import { gql, useQuery } from '@apollo/client';
import ClientRow from './ClientRow';
import Spinner from './Spinner';

import { GET_CLIENTS } from '../queries/clientQueries';  

export default function Clients() {

  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <Spinner />;
  if (error) return <p>Something Went Wrong</p>;
  
  {/* 
      If the page is not loading and there is no error, then load the table. 
      Null Coalescing Operator
  */}
  return <> { !loading && !error && (
    <table className='table table-hover mt-3'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Remove</th>
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


