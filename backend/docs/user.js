import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the user
 *        name:
 *          type: VARCHAR(255)
 *          description: The name of the user
 *        avatar:
 *          type: VARCHAR(255)
 *          description: The avatar of the user
 *        description:
 *          type: TEXT
 *          description: The description of the user
 *        createdAt:
 *          type: DATETIME
 *          description: User creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: User update time
 *      example:
 *        name: Tome
 *        avatar: "https://avatar.com"
 *        description: Hi, I am Tom.
 */

/**
 * @swagger
 * /users:
 *    get:
 *        summary: Returns the lists of the users, need to have the root user authorization
 *        tags: [User]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-name
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *        responses:
 *          200:
 *            description: The lists of the Users
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/User"
 *          400:
 *            description: Request query has error
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /users/{id}:
 *    get:
 *        summary: Get the Users by id
 *        tags: [User]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the user id
 *        responses:
 *          200:
 *            description: The user by id
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/User"
 *          404:
 *            description: The user was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /users/{id}:
 *    patch:
 *        summary: Update the user by id
 *        tags: [User]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The user id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        responses:
 *          200:
 *            description: The user was updated
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/User"
 *          400:
 *            description: Request query has error
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The user was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /users/{id}:
 *    delete:
 *        summary: Remove the user by id
 *        tags: [User]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The user id
 *        responses:
 *          204:
 *            description: The user was deleted successfully.
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The user was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: The users managing API
 */

/**
 * @swagger
 * /users/me:
 *    get:
 *        summary: Get my profile information
 *        tags: [User]
 *        responses:
 *          200:
 *            description: The current profile data
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/User"
 *          401:
 *            description: Unauthorized
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /users/me:
 *    patch:
 *        summary: Update my profile information
 *        tags: [User]
 *        responses:
 *          200:
 *            description: The current profile data
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/User"
 *          400:
 *            description: Not for update password purpose
 *          401:
 *            description: Unauthorized
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /users/me:
 *    delete:
 *        summary: Delete my profile information
 *        tags: [User]
 *        responses:
 *          204:
 *            description: Delete My account successfully!
 *          401:
 *            description: Unauthorized
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /users/avatar:
 *    patch:
 *        summary: Update the suer avatar by form data
 *        tags: [User]
 *        responses:
 *          200:
 *            description: Updated user data
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/User"
 *          401:
 *            description: Unauthorized
 *          500:
 *            description: Unknow error happen
 */
