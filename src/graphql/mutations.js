/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSubmission = /* GraphQL */ `
  mutation CreateSubmission(
    $input: CreateSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    createSubmission(input: $input, condition: $condition) {
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
export const updateSubmission = /* GraphQL */ `
  mutation UpdateSubmission(
    $input: UpdateSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    updateSubmission(input: $input, condition: $condition) {
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
export const deleteSubmission = /* GraphQL */ `
  mutation DeleteSubmission(
    $input: DeleteSubmissionInput!
    $condition: ModelSubmissionConditionInput
  ) {
    deleteSubmission(input: $input, condition: $condition) {
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
