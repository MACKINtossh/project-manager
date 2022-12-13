const Project = require('../models/Project')
const Client = require('../models/Client')
const { 
    GraphQLObjectType, 
    GraphQLSchema ,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
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
             
// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType, 
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) } 
            },
            resolve(parent, args) {
                const client = new Client ({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                })
                return client.save()                
            }  
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
        },
            resolve(parent, args) {
            return Client.findByIdAndRemove(args.id)
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status:  {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': { value: 'In Queue'},
                            'active': { value: 'In Progress'},
                            'completed': { value: 'Completed'}
                        }
                    }),
                    defaultValue: 'In Queue',
                },
                cliendId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.cliendId,
                })
                return project.save()
            } 
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id)
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status:  {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': { value: 'In Queue'},
                            'active': { value: 'In Progress'},
                            'completed': { value: 'Completed'}
                        }
                    }),
                }
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                    },
                },
                { new: true });
            }
        }
    },
})

                
               

            

                
            
        

        
    


 



   
    

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
})