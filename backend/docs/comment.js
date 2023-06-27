import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    Comment:
 *      type: object
 *      required:
 *        - content
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the comment
 *        content:
 *          type: Text
 *          description: The content of the comment
 *        PostId:
 *          type: INT
 *          description: The id of post this comment belongs to. The foreign key of to Post
 *        AuthorId:
 *          type: INT
 *          description: The id of author this comment belongs to. The foreign key of to User
 *        editedAt:
 *          type: DATETIME
 *          description: Comment last edited time
 *        createdAt:
 *          type: DATETIME
 *          description: Comment creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: Comment update time
 *      example:
 *        content: This is a test comment
 *        editedAt: 2023-06-24T10:55:13.000Z
 *        PostId: 28
 *        AuthorId: 3
 */

/**
 * @swagger
 * tags:
 *  name: Comment
 *  description: The comments managing API
 */

/**
 * @swagger
 * /comments:
 *    get:
 *        summary: Returns the lists of the comments
 *        tags: [Comment]
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
 *            description: Add or remove the fields of response. e.g.fields=-content
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
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the comments
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Comment"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /comments/{id}:
 *    get:
 *        summary: Get the comments by id
 *        tags: [Comment]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the comment id
 *        responses:
 *          200:
 *            description: The comment by id
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Comment"
 *          404:
 *            description: The comment was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /comments:
 *    post:
 *        summary: Create a new comment
 *        tags: [Comment]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Comment"
 *        responses:
 *          200:
 *            description: The comment was successfully created
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Comment"
 *          400:
 *            description: Some query property is wrong
 *          401:
 *            description: Unauthorized
 *          422:
 *            description: Some query property is missing
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /comments/{id}:
 *    patch:
 *        summary: Update the comment by id
 *        tags: [Comment]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The comment id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Comment"
 *        responses:
 *          200:
 *            description: The comment was updated
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Comment"
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The comment was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /comments/{id}:
 *    delete:
 *        summary: Remove the comment by id
 *        tags: [Comment]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The comment id
 *        responses:
 *          204:
 *            description: The comment was deleted successfully.
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The comment was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /{:postId}/comments:
 *    get:
 *        summary: Returns all the comments of target post
 *        tags: [Comment]
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
 *            description: Add or remove the fields of response. e.g.fields=-content
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
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the comments
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Comment"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */