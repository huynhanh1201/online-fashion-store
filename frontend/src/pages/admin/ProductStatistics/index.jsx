import ProductStatistics from './ProductStatistic.jsx'

const sampleStats = {
  totalProducts: 10,
  totalCategories: 3,
  totalVariants: 25,
  productsPerCategory: [
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 },
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 },
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 },
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 },
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 },
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 },
    { category: 'Áo học', count: 4 },
    { category: 'Phụ kiện', count: 3 },
    { category: 'Quần áo thể thao', count: 3 }
  ]
}

function DashboardPage() {
  return <ProductStatistics stats={sampleStats} />
}

export default DashboardPage
