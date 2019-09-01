/**
 * 基础 CURD
 */
class BaseDao {
  constructor(model) {
    this.model = model
  }

  /**
   * @param {Object} params 
   */
  async create (params) {
    try {
      const doc = await this.model.create(params)
      return doc
    } catch (error) {
      console.log('BaseDao create ------>', error)
      return error
    }
  }

  /**
   * @param {Object} query 
   * @param {Object} projection 
   */
  async find (query, projection) {
    try {
      const doc = await this.model.find(query, projection)
      return doc
    } catch (error) {
      console.log('BaseDao find ------>', error)
      return error
    }
  }

  /**
   * @param {Object} query 
   */
  async findOne (query, projection) {
    try {
      const doc = await this.model.findOne(query, projection)
      return doc
    } catch (error) {
      console.log('BaseDao findOne ------>', error)
      return error
    }
  }

  /**
   * @param {Object} query 
   * @param {Object} updateDoc 
   */
  async update (query, updateDoc, options ) {
    try {
      const doc = await this.model.update(query, updateDoc, options)
      return doc
    } catch (error) {
      console.log('BaseDao update ------>', error)
      return error
    }
  }

  /**
   * @param {Object} query 
   * @param {Object} updateDoc 
   */
  async updateOne (query, updateDoc ) {
    try {
      const doc = await this.model.update(query, updateDoc, {upsert: false, multi: false})
      return doc
    } catch (error) {
      console.log('BaseDao updateOne ------>', error)
      return error
    }
  }

  /**
   * @param {Object} query 
   * @param {Object} params 
   */
  async updateMany (query, updateDoc) {
    try {
      const doc = await this.model.update(query, updateDoc, {upsert: false, multi: true})
      return doc
    } catch (error) {
      console.log('BaseDao updateMany ------>', error)
      return error
    }
  }

  /**
   * @param {Object} query 
   */
  async remove (query) {
    try {
      const doc = await this.model.remove(query)
      return doc
    } catch (error) {
      console.log('BaseDao remove ------>', error)
      return error
    }
  }

  /**
   * 
   * @param {Array} params 
   */
  async aggregate (params) {
    try {
      const doc = await this.model.aggregate(params)
      return doc
    } catch (error) {
      console.log('BaseDao aggregate ------>', error)
      return error
    }
  }
}

module.exports = BaseDao