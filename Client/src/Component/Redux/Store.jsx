import {configureStore} from '@reduxjs/toolkit'
import appConfigSlice from './Slices/appConfigSlice.jsx'
import postsSlice from './Slices/postsSlice.jsx'
import feedSlice from './Slices/feedSlice.jsx'

export default configureStore ( {
    reducer: {
        appConfig : appConfigSlice,
        posts : postsSlice,
        feed : feedSlice
    }
})