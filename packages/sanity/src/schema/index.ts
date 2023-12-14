// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'
import annotationProduct from './annotations/product'

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
  annotationProduct,
]

// Document types
import collection from './documents/collection'
import colorTheme from './documents/colorTheme'
import guide from './documents/guide'
import article from './documents/article'
import material from './documents/material'
import page from './documents/page'
import person from './documents/person'
import product from './documents/product'
import productVariant from './documents/productVariant'
import promo from './documents/promo'
import banner from './documents/banner'
import landingPage from './documents/landingPage'


const documents = [collection, colorTheme, guide, article, material, page, product, productVariant, person, promo, banner, landingPage]

// Singleton document types
import home from './singletons/home'
import settings from './singletons/settings'
import sharedText from './singletons/sharedText'

const singletons = [home, settings, sharedText]

// Block content
import body from './blocks/body'
import simpleBlockContent from './blocks/simpleBlockContent'

const blocks = [body, simpleBlockContent]

// Object types
import creator from './objects/creator'
import customProductOptionColor from './objects/customProductOption/color'
import customProductOptionSize from './objects/customProductOption/size'
import faqs from './objects/faqs'
import heroCollection from './objects/hero/collection'
import heroHome from './objects/hero/home'
import heroPage from './objects/hero/page'
import imageWithProductHotspots from './objects/imageWithProductHotspots'
import label from './objects/label'
import linkExternal from './objects/linkExternal'
import linkInternal from './objects/linkInternal'
import moduleAccordion from './objects/module/accordion'
import moduleBanner from './objects/module/banner'
import moduleCallout from './objects/module/callout'
import moduleCallToAction from './objects/module/callToAction'
import moduleCollection from './objects/module/collection'
import moduleGrid from './objects/module/grid'
import moduleImage from './objects/module/image'
import moduleImages from './objects/module/images'
import moduleInstagram from './objects/module/instagram'
import moduleProduct from './objects/module/product'
import moduleProducts from './objects/module/products'
import modulePromo from './objects/module/promo'
import moduleTaggedProducts from './objects/module/taggedProducts'
import placeholderString from './objects/placeholderString'
import productHotspots from './objects/productHotspots'
import productOption from './objects/productOption'
import productWithVariant from './objects/productWithVariant'
import proxyString from './objects/proxyString'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoShopify from './objects/seo/shopify'
import shopifyCollection from './objects/shopifyCollection'
import shopifyCollectionRule from './objects/shopifyCollectionRule'
import shopifyProduct from './objects/shopifyProduct'
import shopifyProductVariant from './objects/shopifyProductVariant'

const objects = [
  creator,
  customProductOptionColor,
  customProductOptionSize,
  faqs,
  imageWithProductHotspots,
  label,
  linkExternal,
  linkInternal,
  heroCollection,
  heroHome,
  heroPage,
  moduleAccordion,
  moduleBanner,
  moduleCallout,
  moduleCallToAction,
  moduleCollection,
  moduleGrid,
  moduleImage,
  modulePromo,
  moduleImages,
  moduleInstagram,
  moduleProduct,
  moduleProducts,
  moduleTaggedProducts,
  placeholderString,
  productHotspots,
  productOption,
  productWithVariant,
  proxyString,
  seoHome,
  seoPage,
  seoShopify,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
]

export const types = [...annotations, ...documents, ...singletons, ...objects, ...blocks]
