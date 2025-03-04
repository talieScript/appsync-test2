/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSubmission = /* GraphQL */ `
  query GetSubmission($id: ID!) {
    getSubmission(id: $id) {
      id
      vesselName
      vesselImo
      dateOffset {
        date
        offset
      }
      fuels {
        LGO
        IFO
        MGO
      }
      totalFuel
    }
  }
`;
export const listSubmissions = /* GraphQL */ `
  query ListSubmissions(
    $filter: ModelSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubmissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        vesselName
        vesselImo
        dateOffset {
          date
          offset
        }
        fuels {
          LGO
          IFO
          MGO
        }
        totalFuel
      }
      nextToken
    }
  }
`;
