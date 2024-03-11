import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { People } from './people';

Meteor.methods({
    // Method to check in a person
    'people.checkIn' (personId) {
        check(personId, String);
        const personQuery = { _id: personId };
        const personUpdate = {
            $set: {
                checkedIn: true, // Set checkedIn to true
                checkInDate: Date.now(), // Set checkInDate to current date and time
            },
            // $unset: {
            //     checkOutDate: '', // Uncomment this line to unset checkOutDate
            // },
        };
        const person = People.findOne(personQuery);
        if (!person) throw new Meteor.Error('Person not found');
        if (person?.checkedIn) throw new Meteor.Error('Person already checked in');
        People.update(personQuery, personUpdate);
    },
    // Method to check out a person
    'people.checkOut' (personId) {
        check(personId, String);
        const personQuery = { _id: personId };
        const personUpdate = {
            $unset: {
                checkedIn: '', // Unset checkedIn
            },
            $set: {
                checkOutDate: Date.now(), // Set checkOutDate to current date and time
            },
        };
        const person = People.findOne(personQuery);
        if (!person) throw new Meteor.Error('Person not found');
        if (!person?.checkedIn) throw new Meteor.Error('Person already checked out');
        People.update(personQuery, personUpdate);
    },
});
