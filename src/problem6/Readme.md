# Scoreboard API Service Module Specification

## Overview

This document outlines the specification for the Score Update Module, a component within the API service responsible for processing score updates for the website's leaderboard.

## Functionality
 - Receives a user ID and score update value from the client application.
 - Validates the user's authorization and action legitimacy.
 - Updates the user's score in the database if valid.
 - Returns a success/failure response with details to the client.

## API Endpoints

Api scores board have 2 main function

- `GET /scores-top-10`: Retrieves the top 10 user scores.
- `POST /scores`: Updates a user's score upon completion of an action.


## Security 

To prevent malicious users request data to scores api:

- **IP Address Restriction**: If applicable, consider restricting API access to a specific set of IP addresses associated with your trusted applications. This can help prevent unauthorized attempts originating from unknown locations..
- **Multi-Factor Authentication**: Instead of relying solely on passwords, implement MFA where users need a secondary verification factor (e.g., code from an authenticator app) to log in. This significantly increases the difficulty of unauthorized access.
- **Authentication JWT**: Using JWT to verify person who granted permission to request.

##  Additional comments 
-  **Regular Backups**: Implement a regular backup schedule for your user data and leaderboard information. This ensures data recovery in case of incidents.    
- **Action Logging**: Implement logging functionality to track API requests and responses for monitoring and debugging purposes.
- **Error Handling**: Consider returning more detailed error messages for specific failure scenarios
- **Regular Backups**: Implement a regular backup schedule for your user data and leaderboard information. This ensures data recovery in case of incidents.
## Follow of Execution

![alt text](https://s3.ap-southeast-1.amazonaws.com/top11.animals4life.io/img/1221.PNG)