import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Texts, Collections } from '../infra/constants';
import { People } from './People';
import { Communities as CommunitiesCollection } from '../communities/communities';
import { useTracker } from 'meteor/react-meteor-data';
import { Summary } from './Summary';

export const Communities = () => {
    // State to keep track of the selected community
    const [selectedCommunityId, setSelectedCommunityId] = useState(Texts.SELECT_AN_EVENT);

    // Fetch communities data using useTracker hook
    const { communities, isLoading } = useTracker(() => {
        const noDataAvailable = { communities: [] };
        const handler = Meteor.subscribe(Collections.COMMUNITIES);
        if (!handler.ready()) return { ...noDataAvailable, isLoading: true };
        const data = CommunitiesCollection.find({}).fetch();
        return { communities: data, isLoading: false };
    });

    // Event handler for the select change
    const handleSelectChange = (e) => {
        const { target: { value } } = e;
        setSelectedCommunityId(value);
    };

    return (
        <div>
            <h2>{ Texts.COMMUNITIES }</h2>
            {
                isLoading
                    ? <p>Loading...</p> :
                    <div className="input-field">
                        {/* Event selector */}
                        <select
                            className="browser-default"
                            value={selectedCommunityId}
                            onChange={handleSelectChange}
                        >
                            {/* Default option */}
                            <option
                                value={Texts.SELECT_AN_EVENT}
                            >
                                { Texts.SELECT_AN_EVENT }
                            </option>
                            {/* Render options for each community */}
                            {
                                communities.map(community =>
                                    <option
                                        key={community._id}
                                        value={community._id}
                                    >
                                        { community.name }
                                    </option>
                                )
                            }
                        </select>
                        {/* Display summary component */}
                        <Summary communityId={selectedCommunityId} />
                        {/* Display people component */}
                        <People communityId={selectedCommunityId} />
                    </div>
            }
        </div>
    );
};
