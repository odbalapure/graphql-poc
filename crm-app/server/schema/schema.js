const Project = require("../model/Project");
const Client = require("../model/Client");

// Graphql API
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList
} = require("graphql");

// Client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  description: "Represent a client",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }
});

// Project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  description: "Represent a project",
  fields: {
    id: { type: GraphQLInt },
    clientId: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      description: "Map projects to their client",
      resolve: (parent, args) => {
        // return clients.find(client => client.id === parent.clientId)
        return Client.findById(parent.clientId);
      }
    }
  },
});

// {
//   id: '1',
//   clientId: '1',
//   name: 'eCommerce Website',
//   description:
//     'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.',
//   status: 'In Progress',
// },

// Root query type
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: {
    /* Get a project */
    project: {
      type: ProjectType,
      description: "Get a project details",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // return projects.find(project => project.id === args.id)
        return Project.findById(args.id);
      }
    },
    /* Get all projects */
    projects: {
      type: GraphQLList(ProjectType),
      description: "Get list of projects",
      resolve: () => {
        // return projects
        return Project.find();
      }
    },
    /* Get a client */
    client: {
      type: ClientType,
      description: "Get a client details",
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // return clients.find(client => client.id === args.id)
        return Client.findById(args.id);
      }
    },
    /* Get list of clients */
    clients: {
      type: GraphQLList(ClientType),
      description: "Get list of clients",
      resolve: () => {
        // return clients
        return Client.find();
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType
});