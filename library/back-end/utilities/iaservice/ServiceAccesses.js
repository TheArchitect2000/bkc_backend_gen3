const ServiceAccesses = {
    Home: {
        Name: 1,
        Adress: {
            Country: 1,
            Province: 1,
            City: 1,
            Street: 1,
            ZipCode: 1,
            GPS: {
                lat: 1,
                lng: 1
            }
        },
        Owner: {
            FirstName: 1,
            LastName: 1,
            Username: 1,
            Password: 1,
            UserId: 1,
            Mobile: 1,
        },
        Devices: {
            List : {
                Count : 1
            }
        }
    }
};

module.exports = ServiceAccesses;