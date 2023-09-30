// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 100000).toString()
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static #list = []

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { price, name, description },
  ) => {
    if (price) {
      product.price = price
    }
    if (name) {
      product.name = name
    }
    if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

router.get('/product-create', function (req, res) {
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно був створений',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(id)

  const list = Product.getList()

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',

      data: {
        products: {
          list,
          isEmpty: list.length === 0,
        },
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const isUpdated = Product.updateById(id, {
    name,
    price,
    description,
  })

  if (isUpdated) {
    res.render('alert', {
      style: 'alert',
      info: 'Дані товару успішно оновлено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const isDeleted = Product.deleteById(id)

  if (isDeleted) {
    res.render('alert', {
      style: 'alert',
      info: 'Дані товару успішно видалено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Дані товару не видалено',
    })
  }
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
