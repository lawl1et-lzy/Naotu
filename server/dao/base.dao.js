/**
 * 基础 CURD
 */
class BaseDao {
  constructor(model) {
    this.model = model
  }

  async create (params) {
    try {
      const doc = await this.model.create(params)
      return doc
    } catch (error) {
      console.log('BaseDao create ------>', error)
      return error
    }
  }

  async find (query, projection) {
    try {
      const doc = await this.model.find(query, projection)
      return doc
    } catch (error) {
      console.log('BaseDao find ------>', error)
      return error
    }
  }

  async findById (_id, projection, options) {
    try {
      return await this.model.findById(_id, projection, options)
    } catch (error) {
      console.log('BaseDao findById ------>', error)
      return error
    }
  }

  async findByIdAndUpdate (_id, update, options) {
    try {
      return await this.model.findById(_id, update, options)
    } catch (error) {
      console.log('BaseDao findByIdAndUpdate ------>', error)
      return error
    }
  }

  async findOne (query, projection) {
    try {
      const doc = await this.model.findOne(query, projection)
      return doc
    } catch (error) {
      console.log('BaseDao findOne ------>', error)
      return error
    }
  }

  async findByIdAndUpdate (_id, projection) {
    try {
      const doc = await this.model.findByIdAndUpdate(_id, projection)
      return doc
    } catch (error) {
      console.log('BaseDao findByIdAndUpdate ------>', error)
      return error
    }
  }

  async findWithPopulate (query = {}, findOpts = {}, populateOpts) {
    return await this.model.find(query, findOpts).populate(populateOpts)
  }

  async findByIdWithPopulate (_id, findOpts = {}, populateOpts) {
    return await this.model.findById(_id, findOpts).populate(populateOpts)
  }

  async update (query, updateDoc, options ) {
    try {
      const doc = await this.model.update(query, updateDoc, options)
      return doc
    } catch (error) {
      console.log('BaseDao update ------>', error)
      return error
    }
  }

  async updateOne (query, updateDoc ) {
    try {
      const doc = await this.model.update(query, updateDoc, {upsert: false, multi: false})
      return doc
    } catch (error) {
      console.log('BaseDao updateOne ------>', error)
      return error
    }
  }

  async updateMany (query, updateDoc) {
    try {
      const doc = await this.model.update(query, updateDoc, {upsert: false, multi: true})
      return doc
    } catch (error) {
      console.log('BaseDao updateMany ------>', error)
      return error
    }
  }

  async remove (query) {
    try {
      const doc = await this.model.remove(query)
      return doc
    } catch (error) {
      console.log('BaseDao remove ------>', error)
      return error
    }
  }

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