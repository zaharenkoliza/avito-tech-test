import { Navigate, Route, Routes } from 'react-router-dom'

import { AdDetailsPage } from '@/pages/ad-details'
import { AdEditPage } from '@/pages/ad-edit'
import { AdsListPage } from '@/pages/ads-list'

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/ads" element={<AdsListPage />} />
			<Route path="/ads/:id" element={<AdDetailsPage />} />
			<Route path="/ads/:id/edit" element={<AdEditPage />} />
			<Route path="*" element={<Navigate to="/ads" replace />} />
		</Routes>
	)
}

