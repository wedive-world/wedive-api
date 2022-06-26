const { gql } = require('apollo-server')

module.exports = gql`

type Query {
    QUERY____________________________DiveShops: DiveShop
    getDiveShops(skip: Int = 0, limit: Int = 100): [DiveShop]
    getAllDiveShops: [DiveShop]
    getDiveShopById(_id: ID!): DiveShop
    getDiveShopByUniqueName(uniqueName: String!): DiveShop
    getDiveShopsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!, limit: Int = 20): [DiveShop]
    searchDiveShopsByName(query: String!): [DiveShop]
    getNearByDiveShops(lat: Float!, lon: Float!, m: Int): [DiveSite]
}

type Mutation {
    MUTATION_______DiveShops_______: DiveShop
    upsertDiveShop(input: DiveShopInput!): DiveShop!
    deleteDiveShopById(_id: ID!): ID
}

type DiveShop  {

    _id: ID!

    managers: [User]
    clerks: [User]

    divingType: [DivingType]
    enteranceLevelFree: String
    enteranceLevelScuba: String

    enteranceFee: String

    phoneNumber: String
    email: String
    webPageUrl: String
    geoAddress: String
    openingHours: [[String]]

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]

    weeklyHolidays: [DayType]
    monthlyHolidays: [MonthlyHoliday]
    annualHolidays: [AnnualHoliday]
    customHolidays: [CustomHoliday]
    annualLunarHolidays: [AnnualHoliday]
    customLunarHolidays: [CustomHoliday]
    openingTimes: [OpeningTime]
    customOpeningTimes: [CustomOpeningTime]
    isOpened: Boolean

    createdAt: Date
    updatedAt: Date
    typeDef: String
}

input DiveShopInput {
    _id: ID

    publishStatus: PublishStatus

    managers: [ID]
    clerks: [ID]

    divingType: [DivingType]
    enteranceLevelFree: String
    enteranceLevelScuba: String

    enteranceFee: String

    phoneNumber: String
    email: String
    webPageUrl: String
    geoAddress: String
    openingHours: [[String]]

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]
    
    weeklyHolidays: [DayType]
    monthlyHolidays: [MonthlyHolidayInput]
    annualHolidays: [AnnualHolidayInput]
    customLunarHolidays: [CustomHolidayInput]
    annualLunarHolidays: [AnnualHolidayInput]
    customHolidays: [CustomHolidayInput]
    openingTimes: [OpeningTimeInput]
    customOpeningTimes: [CustomOpeningTimeInput]
}

type DiveSite {
    diveShops: [DiveShop]
}

type DivePoint {
    diveShops: [DiveShop]
}

type Diving {
    diveShops: [DiveShop]
}

input DivingInput {
    diveShops: [ID]
}

type Reservation {
    diveShop: DiveShop
}

input ReservationInput {
    diveShop: ID!
}

enum DayType {
    mon
    tue
    wed
    thu
    fri
    sat
    sun
    holiday
}

type MonthlyHoliday {
    nWeek: Int
    dayTypes: [DayType]
}

input MonthlyHolidayInput {
    nWeek: Int
    dayTypes: [DayType]
}

type AnnualHoliday {
    month: Int
    day: Int
}

input AnnualHolidayInput {
    month: Int
    day: Int
}

type CustomHoliday {
    year: Int
    month: Int
    day: Int
}

input CustomHolidayInput {
    year: Int
    month: Int
    day: Int
}

type OpeningTime {
    dayType: DayType
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

input OpeningTimeInput {
    dayType: DayType
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

type CustomOpeningTime {

    year: Int
    month: Int
    day: Int

    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

input CustomOpeningTimeInput {
    year: Int
    month: Int
    day: Int

    dayType: DayType
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

`;