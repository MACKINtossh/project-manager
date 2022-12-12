const { projects, clients } = require('../sampleData')

// Mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')



const { 
    GraphQLObjectType, 
    GraphQLSchema ,
    GraphQLList,
    GraphQLID, 
    GraphQLString, 
} = require('graphql')

// Types
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
})
 
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId)
                
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }

        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // This takes the clients array and calls the find function. The find find function loops through the clients array and where the client id is equal to the args id.
                return Client.findById(args.id)

            }

        },
        projects: {

            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                //    queries for all projects, but only from the test data: sampleData.js
                //    return projects; 
                //    Project.find() uses the project mongoose schema to query the database.
                return Project.find()
            }
        },
     
        project: {

            type: ProjectType,
            args: { id: { type: GraphQLID }, clientId: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },
    }
})
             
        
    

module.exports = new GraphQLSchema({
    query: RootQuery
})