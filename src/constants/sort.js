export const DefaultSort = {
    newest: {
        name: "Newest",
        value: "createdAt,-1"
    },
    oldest: {
        id: "createdAt",
        name: "Oldest",
        value: "createdAt,1"
    },
};

export const NameSort = {
    name: {
        name: "Name",
        value: "name,0"
    },
    ...DefaultSort
};

export const AttendanceSort = {
    checkIn: {
        name: "Check In",
        value: "checkIn,-1"
    },
    checkOut: {
        name: "Check Out",
        value: "checkOut,-1"
    }
};