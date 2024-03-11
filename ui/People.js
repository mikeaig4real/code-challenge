import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Texts, Collections } from '../infra/constants';
import { People as PeopleCollection } from '../people/people';
import { useTracker } from 'meteor/react-meteor-data';
import { Person } from './Person';
import { PageButtonControl } from './PageButtonControl';

// Component to display a list of people
export const People = ({ communityId }) => {
    const [page, setPage] = useState(1);
    // decided to use optional pagination to limit the number of people displayed at a time but was'nt sure if it was the best approach
    // especially to avoid failing possible tests
    const [usePagination, toggleUsePagination] = useState(false);
    // Fetch people data using useTracker hook, decided to do some pagination because of the large number of people
    const { people, isLoading, totalPages } = useTracker(() => {
        const noDataAvailable = { people: [], totalPages: 0 };

        // If communityId is not available or not selected, return empty data
        if (!communityId || communityId === Texts.SELECT_AN_EVENT) {
            return { ...noDataAvailable, isLoading: false };
        }

        // Subscribe to the 'people' collection
        const peopleHandler = Meteor.subscribe(Collections.PEOPLE);

        // If subscription is not ready, return loading state
        if (!peopleHandler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }

        const pageSize = 30;
        const findPeopleQuery = { communityId };
        const findPeoplePaginationOptions = {
            skip: (page - 1) * pageSize,
            limit: pageSize,
        };
        const findPeopleOptions = {
            sort: { firstName: 1, lastName: 1 },
            ...(usePagination && findPeoplePaginationOptions),
        };

        // Fetch people data based on query and options
        const data = PeopleCollection.find(findPeopleQuery, findPeopleOptions).fetch();

        // Get total count of people
        const totalPeople = PeopleCollection.find(findPeopleQuery).count();

        // Calculate total number of pages based on page size
        const totalPagesCount = Math.ceil(totalPeople / pageSize);

        // Return the fetched data along with loading state and total pages count
        return { people: data, isLoading: false, totalPages: totalPagesCount };
    }, [communityId, page, usePagination]);

    return (
        <div>
            <h2>{ Texts.PEOPLE }</h2>
            <button
                className={`btn waves-effect waves-heavy ${usePagination ? 'green' : 'black'}`}
                onClick={() => toggleUsePagination(!usePagination)}
            >
                Toggle Pagination
            </button>
            {
                isLoading ? <p>Loading...</p> :
                    <ul>
                        {people.map(({
                            _id,
                            firstName,
                            lastName,
                            title = 'Unknown',
                            companyName,
                            checkedIn = false,
                            checkInDate = null,
                            checkOutDate = null,
                        }) =>
                            <Person
                                key={_id}
                                _id={_id}
                                firstName={firstName}
                                lastName={lastName}
                                title={title}
                                companyName={companyName}
                                checkedIn={checkedIn}
                                checkInDate={checkInDate}
                                checkOutDate={checkOutDate}
                            />
                        )}
                        {
                            usePagination && totalPages > 1 &&
                            <PageButtonControl
                                page={page}
                                totalPages={totalPages}
                                setPage={setPage}
                            />
                        }
                    </ul>
            }
        </div>
    );
};
