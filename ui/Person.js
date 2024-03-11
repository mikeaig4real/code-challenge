import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';

// The Person component represents an individual person in the list
export const Person = ({ _id, firstName, companyName, title, lastName, checkInDate, checkOutDate, checkedIn }) => {
    const [textKey, setTextKey] = useState('checkIn');

    // Format the date in MM/DD/YYYY, HH:mm format or 'N/A' if date is not available
    const formatDate = (date) => {
        if (date) {
            const formattedDate = new Date(date).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
            return formattedDate;
        }
        return 'N/A';
    };

    // Handle check-in button click
    const handleCheckIn = () => {
        if (checkedIn) return; // Do nothing if already checked in
        Meteor.call('people.checkIn', _id); // Call the check-in method
    };

    // Handle check-out button click
    const handleCheckOut = () => {
        if (!checkedIn) return; // Do nothing if not checked in
        Meteor.call('people.checkOut', _id); // Call the check-out method
        setTextKey('checkIn'); // Set the text key to 'checkIn' after check-out
    };

    // Generate the text for the check-in/check-out button
    const generateButtonText = () => {
        const textMap = {
            checkIn: `Check-in ${firstName} ${lastName}`,
            checkOut: `Check-out ${firstName} ${lastName}`,
        };
        return textMap[textKey];
    };

    // Update the text key to 'checkOut' if checked in for more than 5 seconds
    useEffect(() => {
        const maxCheckInTime = 5000;
        let timeout;

        // Set the timeout to change the text key to 'checkOut' after 5 seconds
        if (checkedIn) {
            // Calculate the time elapsed since check-in
            const timeElapsed = Date.now() - new Date(checkInDate).getTime();
            // Calculate the remaining time to reach 5 seconds, if timeElapsed is beyond maxCheckInTime, hence no need to wait till 5 seconds
            const timeOutMilliseconds = Math.max(maxCheckInTime - timeElapsed, 0);

            // Set the timeout to change the text key to 'checkOut' after the remaining time
            timeout = setTimeout(() => {
                setTextKey('checkOut');
            }, timeOutMilliseconds);
        }

        return () => clearTimeout(timeout); // Clear the timeout when component unmounts
    }, [checkedIn]);

    return (
        <li
            key={_id}
            className="card-panel hoverable"
        >
            <hr />
            <h6>FullName :</h6> { firstName } { lastName }
            <br />
            <h6>Company :</h6> { companyName }
            <br />
            <h6>Title :</h6> { title }
            <br />
            <h6>Check-in Date :</h6> { formatDate(checkInDate) }
            <br />
            <h6>Check-out Date :</h6> { formatDate(checkOutDate) }
            <br />
            <hr />
            { textKey === 'checkIn' ? (
                <button
                    className="btn waves-effect waves-light"
                    disabled={checkedIn}
                    onClick={handleCheckIn}>{ generateButtonText() }
                </button>
            ) : (
                <button
                    className="btn waves-effect waves-light"
                    onClick={handleCheckOut}>{ generateButtonText() }
                </button>
            ) }
        </li>
    );
};
