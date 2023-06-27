import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      required:
 *        - name
 *        - ParentId
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the category
 *        name:
 *          type: VARCHAR(100)
 *          description: The name of the category
 *        ParentId:
 *          type: int
 *          description: The subcategory of other category. The foreign key of other category id, only the root category allow ParentId to be null.
 *        createdAt:
 *          type: DATETIME
 *          description: Category creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: Category update time
 *      example:
 *        name: Music
 *        ParentId: 3
 */

/**
 * @swagger
 * tags:
 *  name: Category
 *  description: The categories managing API
 */

/**
 * @swagger
 * /categories:
 *    get:
 *        summary: Returns the lists of the Categories
 *        tags: [Category]
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
 *            description: The lists of the Categories
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Category"
 *          400:
 *            description: Request query has error
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Category"
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /categories/{id}:
 *    get:
 *        summary: Get the Categories by id
 *        tags: [Category]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the category id
 *        responses:
 *          200:
 *            description: The category by id
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Category"
 *          404:
 *            description: The category was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /categories:
 *    post:
 *        summary: Create a new category
 *        tags: [Category]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Category"
 *        responses:
 *          200:
 *            description: The category was successfully created
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Category"
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
 * /categories/{id}:
 *    patch:
 *        summary: Update the category by id
 *        tags: [Category]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The category id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Category"
 *        responses:
 *          200:
 *            description: The category was updated
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Category"
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The category was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /categories/{id}:
 *    delete:
 *        summary: Remove the category by id
 *        tags: [Category]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The category id
 *        responses:
 *          204:
 *            description: The category was deleted successfully.
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The category was not found
 *          500:
 *            description: Unknow error happen
 */
