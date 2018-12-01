const fs = require('fs');
const cliProgress = require('cli-progress');

// Util scripts
const logger = require('../utils/logger');
const abortWithError = require('../utils/abortWithError');
const { getPathByConstantName } = require('../utils/pathUtil');


function getNumberOfDataItems(data) {
	const isArray = Array.isArray(data);
	const dataLength = isArray ? data.length : Object.keys(data).length;

	return dataLength;
}

function getRelevantEntityType(entityTypes) {
	let entityType;
	const relevantEntityTypes = ['person', 'location', 'organisation', 'event'];

	entityTypes.forEach((type) => {
		const regexPattern = '[^/]+$';
		const regex = new RegExp(regexPattern);
		const matchedReg = type.match(regex);
		const extractedType = matchedReg[0].toLowerCase();

		const isRelevantEntityType = relevantEntityTypes.includes(extractedType);

		if (isRelevantEntityType) {
			entityType = extractedType;
		}
	});

	return entityType || '';
}

function getRelevantDataFromFiles(dataPaths) {
	return new Promise((resolve) => {
		const dataPathsKeys = Object.keys(dataPaths);
		const data = {};

		logger.logTitle('Read data from files:');
		dataPathsKeys.forEach((dataPathKey) => {
			const dataPath = dataPaths[dataPathKey];
			try {
				const rawDataFromFile = fs.readFileSync(dataPath, 'utf8');
				const dataFromFile = JSON.parse(rawDataFromFile);

				logger.logKeyValuePair({ key: `${dataPathKey}`, value: '✓' });

				data[dataPathKey] = dataFromFile;
			} catch (error) {
				if (error.code === 'ENOENT') {
					console.log(`FILE NOT FOUND: ${dataPath}`);
				} else {
					throw error;
				}
			}
		});
		logger.logEnd();

		resolve(data);
	});
}

function clusterEntities(data) {
	const { rawEntities } = data;
	const clusteredEntities = {};
	const addEntity = (entity, fileName) => {
		const { title } = entity;
		const hasEntity = Object.prototype.hasOwnProperty.call(clusteredEntities, title);
		if (!hasEntity) {
			clusteredEntities[title] = {
				fileNames: [fileName],
				...entity,
			};
		} else {
			const { fileNames } = clusteredEntities[title];
			fileNames.push(fileName);
		}
	};

	rawEntities.forEach((datum) => {
		const { entities, fileName } = datum;

		if (entities && entities instanceof Array) {
			entities.forEach((entity) => {
				addEntity(entity, fileName);
			});
		} else {
			addEntity(entities, fileName);
		}
	});

	return { ...data, rawEntities: clusteredEntities };
}

function splitEntityTypes(data) {
	const { rawEntities } = data;

	Object.keys(rawEntities).forEach((entityKey) => {
		const entity = rawEntities[entityKey];

		const { types } = entity;
		if (types && types.length > 0) {
			const relevantEntityType = getRelevantEntityType(types);
			entity.relevantType = relevantEntityType;

			// console.log(rawEntities[entityKey].fileNames.length);
			// console.log(entityKey);
			// console.log(types);
		}
	});

	return data;
}

function createGraphcoolBriefingBook() {

}

function createGraphcoolClassification() {

}

function createGraphcoolDocument() {

}

function createGraphcoolEvent() {

}

function createGraphcoolKind() {

}

function createGraphcoolLocation() {

}

function createGraphcoolStackeholder() {

}

function createGraphcoolFile() {

}

function createGraphcoolRelations() {

}

const relevantDataPaths = {
	documents: getPathByConstantName('DOCUMENTS_DATA_PATH'),
	events: getPathByConstantName('EVENTS_DATA_PATH'),
	kinds: getPathByConstantName('RAW_KINDS'),
	classifications: getPathByConstantName('RAW_CLASSIFICATIONS'),
	rawEntities: getPathByConstantName('RAW_ENTITIES'),
};

getRelevantDataFromFiles(relevantDataPaths)
	.then(clusterEntities)
	.then(splitEntityTypes)
	// // Create Graphcool NODES
	// .then(createGraphcoolBriefingBook)
	// .then(createGraphcoolClassification)
	// .then(createGraphcoolDocument)
	// .then(createGraphcoolEvent)
	// .then(createGraphcoolKind)
	// .then(createGraphcoolLocation)
	// .then(createGraphcoolStackeholder)
	// .then(createGraphcoolFile) // System?
	// // Create Graphcool RELATIONS
	// .then(createGraphcoolRelations)
	.then(() => console.log('done'))
	.catch(abortWithError);
