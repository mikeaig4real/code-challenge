import React from 'react';

export const PageButtonControl = ({ page, setPage, totalPages }) => {
    // Create an array of page numbers based on the total number of pages
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Function to change the current page
    const changePage = (newPage) => setPage(newPage);

    return (
        <div>
            {
                // Map through the array of pages and render a button for each page
                pages.map((p) =>
                    <button
                        key={p}
                        className="btn waves-effect waves-heavy"
                        onClick={() => changePage(p)}
                        disabled={p === page}
                    >
                        { p }
                    </button>
                )
            }
        </div>
    );
};
