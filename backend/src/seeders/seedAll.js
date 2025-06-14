import { seedRoles } from '../seeders/scripts/seedRoles.js'
import { seedPermissions } from '../seeders/scripts/seedPermissions.js'

// Chạy các hàm seed để tạo dữ liệu mẫu
await seedRoles()

await seedPermissions()
