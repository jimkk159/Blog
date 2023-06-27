import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    Tag:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the tag
 *        name:
 *          type: VARCHAR(50)
 *          description: The name of the tag
 *        createdAt:
 *          type: DATETIME
 *          description: Tag creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: Tag update time
 *      example:
 *        name: Test tag
 */

/**
 * @swagger
 * tags:
 *  name: Tag
 *  description: The tags managing API
 */

/**
 * @swagger
 * /tags:
 *    get:
 *        summary: Returns the lists of the Tags
 *        tags: [Tag]
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
 *            description: The lists of the Tags
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Tag"
 *          400:
 *            description: Request query has error
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Tag"
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /tags/{id}:
 *    get:
 *        summary: Get the Tags by id
 *        tags: [Tag]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the tag id
 *        responses:
 *          200:
 *            description: The tag by id
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Tag"
 *          404:
 *            description: The tag was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /tags:
 *    post:
 *        summary: Create a new tag
 *        tags: [Tag]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Tag"
 *        responses:
 *          200:
 *            description: The tag was successfully created
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Tag"
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
 * /tags/{id}:
 *    patch:
 *        summary: Update the tag by id
 *        tags: [Tag]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The tag id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Tag"
 *        responses:
 *          200:
 *            description: The tag was updated
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Tag"
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The tag was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /tags/{id}:
 *    delete:
 *        summary: Remove the tag by id
 *        tags: [Tag]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The tag id
 *        responses:
 *          204:
 *            description: The tag was deleted successfully.
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The tag was not found
 *          500:
 *            description: Unknow error happen
 */
