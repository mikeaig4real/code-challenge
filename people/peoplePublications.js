import { Meteor } from 'meteor/meteor';
import { People } from './people';

// Publishes the 'people' collection to the client
Meteor.publish('people', function publishPeople () {
    // Returns all documents from the 'People' collection
    return People.find({});
});
