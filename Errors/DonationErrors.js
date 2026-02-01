const APIError = require('./APIError');

class DonationErrors {
  static DonationNotFound = new APIError('The specified Donation was not found.', 404);
  
  static InvalidDonationData = new APIError('The provided donation data is invalid.', 400);

  static ServiceUnavailable = new APIError('The service is unavailable.', 503);

  static UnauthorizedDonationAccess = new APIError('You do not have permission to access this donation.', 403);
  
  static InvalidSignature = new APIError('The signature is invalid.', 400);
}

module.exports = DonationErrors;