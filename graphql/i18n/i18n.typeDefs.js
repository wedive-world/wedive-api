const { gql } = require('apollo-server')

module.exports = gql`

interface i18nName {name: String}
interface i18nDescription {description: String}
interface i18nAddress {address: String}
interface i18nTitle {title: String}
interface i18nVisitTimeDescription {visitTimeDescription: String}
interface i18nWaterTemperatureDescription {waterTemperatureDescription: String}
interface i18nDeepDescription {deepDescription: String}
interface i18nWaterFlowDescription {waterFlowDescription: String}
interface i18nEyeSightDescription {eyeSightDescription: String}
interface i18nHighlightDescription {highlightDescription: String}
interface i18nAliasesString {aliasesString: String}
interface i18nSearchTermsString { searchTermsString: String }
interface i18nUnitName { unitName: String }

type DiveSite implements i18nName 
  & i18nDescription 
  & i18nAddress 
  & i18nVisitTimeDescription 
  & i18nWaterTemperatureDescription 
  & i18nDeepDescription 
  & i18nWaterFlowDescription 
  & i18nEyeSightDescription 
  & i18nHighlightDescription

`;