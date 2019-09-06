/**
 * 基础 CURD
 */
class BaseDao {
  constructor(model) {
    this.model = model
  }

  async create (docs) {
    try {
      return await this.model.create(docs)
    } catch (error) {
      console.log('BaseDao create ------>', error)
      return error
    }
  }

  async insertMany (docs, opts) {
    try {
      return await this.model.insertMany(docs, opts)
    } catch (error) {
      console.log('BaseDao insertMany ------>', error)
      return error
    }
  }

  async find (filter, projection) {
    try {
      return await this.model.find(filter, projection)
    } catch (error) {
      console.log('BaseDao find ------>', error)
      return error
    }
  }

  async findById (_id, projection, opts) {
    try {
      return await this.model.findById(_id, projection, opts)
    } catch (error) {
      console.log('BaseDao findById ------>', error)
      return error
    }
  }

  async findByIdAndUpdate (_id, update, opts) {
    try {
      return await this.model.findByIdAndUpdate(_id, update, opts)
    } catch (error) {
      console.log('BaseDao findByIdAndUpdate ------>', error)
      return error
    }
  }

  async findOne (query, projection, opts) {
    try {
      return await this.model.findOne(query, projection, opts)
    } catch (error) {
      console.log('BaseDao findOne ------>', error)
      return error
    }
  }

  async findWithPopulate ({query = {}, projection = {}, opts = {}, populateOpts}) {
    try {
      return await this.model.find(query, projection, opts).populate(populateOpts)
    } catch (error) {
      console.log('BaseDao findWithPopulate ------>', error)
      return error
    }
  }

  async findByIdWithPopulate ({_id, projection = {}, opts = {}, populateOpts}) {
    try {
      return await this.model.findById(_id, projection, opts).populate(populateOpts)
    } catch (error) {
      console.log('BaseDao findByIdWithPopulate ------>', error)
      return error
    }
  }

  async update (query, updateDoc, opts ) {
    try {
      return await this.model.update(query, updateDoc, opts)
    } catch (error) {
      console.log('BaseDao update ------>', error)
      return error
    }
  }

  async updateOne (query, updateDoc ) {
    try {
      return await this.model.update(query, updateDoc, {upsert: false, multi: false})
    } catch (error) {
      console.log('BaseDao updateOne ------>', error)
      return error
    }
  }

  async updateMany (query, updateDoc) {
    try {
      return await this.model.update(query, updateDoc, {upsert: false, multi: true})
    } catch (error) {
      console.log('BaseDao updateMany ------>', error)
      return error
    }
  }

  async remove (query) {
    try {
      return await this.model.remove(query)
    } catch (error) {
      console.log('BaseDao remove ------>', error)
      return error
    }
  }

  async aggregate (params) {
    try {
      return await this.model.aggregate(params)
    } catch (error) {
      console.log('BaseDao aggregate ------>', error)
      return error
    }
  }
}

module.exports = BaseDao