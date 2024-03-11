import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Texts, Collections } from '../infra/constants';
import { People as PeopleCollection } from '../people/people';
import { useTracker } from 'meteor/react-meteor-data';

// Summary component
export const Summary = ({ communityId }) => {
    // Destructure the values from the useTracker hook
    const { peopleInCommunityCount, peopleByCompanyInCommunityText, peopleNotCheckedInCount, isLoading } = useTracker(() => {
        // Define a default object when no data is available
        const noDataAvailable = { peopleInCommunityCount: 0, peopleByCompanyInCommunityText: 'None', peopleNotCheckedInCount: 0 };

        // Check if communityId is not available or default is what is selected
        if (!communityId || communityId === Texts.SELECT_AN_EVENT) {
            return { ...noDataAvailable, isLoading: false };
        }

        // Subscribe to the PEOPLE collection
        const peopleHandler = Meteor.subscribe(Collections.PEOPLE);

        // If the subscription is not ready, return the default object with isLoading set to true
        if (!peopleHandler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }

        // Define the queries and options for fetching data from the PeopleCollection
        const checkedInEventQuery = { communityId, checkedIn: true };
        const notCheckedInQuery = { ...checkedInEventQuery, checkedIn: { $exists: false } };
        const peopleByCompanyOptions = {
            fields: { companyName: 1 },
            sort: { companyName: 1 },
        };

        // Fetch the data from the PeopleCollection and perform necessary calculations
        const peopleInCommunityCountData = PeopleCollection.find(checkedInEventQuery).count();
        const peopleByCompanyInCommunityData = PeopleCollection.find(checkedInEventQuery, peopleByCompanyOptions).fetch().reduce((acc, { companyName }) => {
            const company = companyName || 'Unknown';
            acc[company] = acc[company] ? acc[company] + 1 : 1;
            return acc;
        }, {});

        // Format the data for displaying people by company in the community
        const groupByCompany = Object.entries(peopleByCompanyInCommunityData).map(([company, count]) => `${company} (${count})`).join(', ');

        // Fetch the count of people who are not checked-in
        const peopleNotCheckedInCountData = PeopleCollection.find(notCheckedInQuery).count();

        // Return the data along with isLoading set to false
        return {
            peopleInCommunityCount: peopleInCommunityCountData,
            peopleByCompanyInCommunityText: groupByCompany,
            peopleNotCheckedInCount: peopleNotCheckedInCountData,
            isLoading: false,
        };
    }, [communityId]);

    // Render the Summary component
    return (
        <div className="right sticky card-panel border-light mw-500px">
            <h2>{Texts.SUMMARY}</h2>
            {
                // Show loading message if isLoading is true, otherwise render the summary data
                isLoading ? <p>Loading...</p> :
                    <div>
                        <p>{'People in the event right now: '}<h6>{peopleInCommunityCount}</h6></p>
                        <p className="mh-40percent">{`People by company in the event right now: ${peopleByCompanyInCommunityText || 'None'}`}</p>
                        <p>{'People not checked-in: '}<h6>{peopleNotCheckedInCount}</h6></p>
                    </div>
            }
            <br />
        </div>
    );
};
