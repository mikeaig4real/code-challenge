import { Meteor } from 'meteor/meteor';
import { loadInitialData } from '../infra/initial-data';
// load communities publications
import '../communities/communitiesPublications';
// load people publications
import '../people/peoplePublications';
// load people methods
import '../people/peopleMethods';

Meteor.startup(() => {
  // DON'T CHANGE THE NEXT LINE
  loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
});
