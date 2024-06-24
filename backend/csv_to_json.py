import csv
import json
import numpy as np

# Function to convert a CSV to JSON from the form:
# ['ID', 'Name', timestamps...]
# [entryID, entryName, entryValues...]
# to the form:
# {
#     entries: [{
#         label: string,
#         data: [numbers]
#     }],
#     xLabels: []
# }
# Takes the file paths as arguments
# returns JSON object as a dictionary
def get_json_data(csvFilePath):
     
    # create a dictionary
    data = {}

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.reader(csvf)
        
        # For the first row, extract XLabels
        first_row = np.array(next(csvReader))
        xlabels = first_row[2:].tolist()

        entries = []
        # For the remaining rows, convert into entry object
        for row in csvReader:
            # initialise entry dictionary
            entry = {}
            # extract as array
            entry_row = np.array(row)
            # entry['ID'] = str(entry_row[0])
            entry['label'] = str(entry_row[1])
            entry['data'] = entry_row[2:].tolist()
            entries.append(entry)
        
        # create data dictionary
        data['entries'] = entries
        data['xLabels'] = xlabels

    # return JSON object
    return data

