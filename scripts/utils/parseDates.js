const chrono = require('chrono-node');

const isDateFormat = testDate => testDate instanceof Date;

function parsedDates([documents, events]) {
    const documentsWithParsedDates = documents.map((document, index) => {
        const { date, publicationDate } = document;

        const parsedDate = isDateFormat(date) ? date : chrono.parseDate(date);
        const parsedPublicationDate = isDateFormat(publicationDate)
            ? publicationDate
            : chrono.parseDate(publicationDate);

        return {
            ...document,
            date: parsedDate,
            publicationDate: parsedPublicationDate
        };
    });

    const eventsWithParsedDates = events.map((event, index) => {
        const { startDate, endDate } = event;

        const parsedStartDate = isDateFormat(startDate)
            ? startDate
            : chrono.parseDate(startDate);
        const parsedEndDate = isDateFormat(endDate)
            ? endDate
            : chrono.parseDate(endDate);

        return {
            ...event,
            startDate: parsedStartDate,
            endDate: parsedEndDate
        };
    });

    return [documentsWithParsedDates, eventsWithParsedDates];
}

module.exports = parsedDates;
