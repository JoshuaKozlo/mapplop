

def runscript():
    import json
    from venues.models import City

    usa = r'/home/josh/Desktop/SHARE/scripts/AddUSACitiesToGeoDjangoDB/USACities.json'

    with open(usa) as data_file:
        data = json.load(data_file)
        

    for city in data['features']:
        NAME = city['properties']['NAME']
        COUNTY = city['properties']['COUNTY']
        STATE = city['properties']['STATE']
        POPULATION = int(city['properties']['POP_2010'])
        LON = round(city['geometry']['coordinates'][0], 5)
        LAT = round(city['geometry']['coordinates'][1], 5)
       
        q = City(name = NAME, county = COUNTY, state = STATE, population = POPULATION, lat = LAT, lon = LON)
        try:
            q.save()
        except:
            print(NAME)

