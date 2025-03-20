import { PageRequest } from './dto/page.request.ts'
import { BannerDto } from './dto/banner.dto.ts'
import { PageResponse } from './dto/page.response.ts'

class BannerService {
    private readonly BANNER_KEY = 'banners'

    async createBanner(banner: BannerDto) {
        const banners = this.listBanners()

        // Check for duplicates
        if (banners.some((existing) => existing.id === banner.id)) {
            throw new Error('A banner with this ID already exists.')
        } else if (banners.some((existing) => existing.link === banner.link)) {
            throw new Error('A banner with this link already exists.')
        }

        // Generate a unique ID if is needed
        if (!banner.id) {
            banner.id = crypto.randomUUID()
        }

        banners.push(banner)
        this.saveBanners(banners)

        return banner
    }

    async getBanners(page: PageRequest) {
        if (!page.page) page.page = 0
        if (!page.pageSize) page.pageSize = 12
        let banners = this.listBanners()
        const total = banners.length
        banners = banners.slice(page.page * page.pageSize, (page.page + 1) * page.pageSize)
        if (page.orderBy) {
            banners = banners.sort((a, b) => {
                const valueA = (Object.entries(a).find((value) => value[0] === page.orderBy) ||
                    [])[1]
                const valueB = (Object.entries(b).find((value) => value[0] === page.orderBy) ||
                    [])[1]
                if (valueA < valueB) return -1
                if (valueA > valueB) return 1
                return 0
            })
            if (page.orderType === 'desc') {
                banners = banners.reverse()
            }
        }

        return {
            content: banners,
            pageSize: page.pageSize,
            pageNumber: page.page,
            maxPageNumber: total / page.pageSize,
        } as PageResponse<BannerDto>
    }

    async getBanner(id: string) {
        return this.listBanners().find((banner) => banner.id === id)
    }

    async updateBanner(id: string, banner: BannerDto) {
        const banners = this.listBanners()
        const index = banners.findIndex((banner) => banner.id === id)
        if (index === -1) {
            throw new Error('Banner not found')
        }
        // Check for duplicates
        if (banners.some((existing) => existing.link === banner.link && existing.id !== id)) {
            throw new Error('A banner with this link already exists.')
        }

        // Update the fields
        banners[index].link = banner.link
        banners[index].imageUrl = banner.imageUrl

        // Save the updated list
        this.saveBanners(banners)

        // Return the updated banner
        return banners[index]
    }

    async deleteBanner(id: string) {
        const banners = this.listBanners()
        const index = banners.findIndex((banner) => banner.id === id)
        if (index === -1) {
            throw new Error('Banner not found')
        }

        // Remove the banner from the list
        banners.splice(index, 1)

        // Save the updated list
        this.saveBanners(banners)
    }

    private listBanners() {
        return JSON.parse(localStorage.getItem(this.BANNER_KEY) || '[]') as BannerDto[]
    }

    private saveBanners(banners: BannerDto[]) {
        localStorage.setItem(this.BANNER_KEY, JSON.stringify(banners))
    }
}

export default new BannerService()
