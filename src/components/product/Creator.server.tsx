import {Link} from '@shopify/hydrogen';
import {SanityCreator, ProductWithNodes} from '../../types';
import PortableText from '../portableText/PortableText.server';
import Square from '../elements/Square';

type Props = {
  storefrontProduct: ProductWithNodes;
  creator: SanityCreator;
};

export default function Creator({storefrontProduct, creator}: Props) {
  return (
    <div className="mb-10 grid grid-cols-3 gap-3 lg:grid-cols-6">
      <Square />
      <div className="col-span-2">
        <Square className="relative overflow-hidden rounded bg-lightGray">
          <img
            src="https://images.unsplash.com/photo-1519993796861-26556330a4a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2375&q=80"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt=""
          />
          {/* {creator.person.image && (
            <SanityImage
              alt={creator.person.image?.altText}
              crop={creator.person.image?.crop}
              dataset={sanityConfig.dataset}
              hotspot={creator.person.image?.hotspot}
              layout="fill"
              objectFit="cover"
              projectId={sanityConfig.projectId}
              sizes="25vw"
              src={creator.person.image?.asset._ref}
            />
          )} */}
        </Square>
      </div>
      <Square />
      <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
        <div className="col-span-2">
          <div className="">
            <div className="tracking-tight text-xl font-bold text-purple-600">
              {creator.person.name}
            </div>
            {creator.role && (
              <div className="tracking-tight mb-2 text-xl text-purple-600">
                {`${creator.role.charAt(0).toUpperCase()}${creator.role.slice(
                  1,
                )}`}{' '}
                of the {storefrontProduct.title}
              </div>
            )}
            <PortableText className="text-sm" blocks={creator.person.bio} />
          </div>
        </div>
        <Link to={creator.person.slug}>
          <Square className="flex items-center overflow-hidden rounded bg-purple-600 hover:bg-purple-800">
            <div className="tracking-tight block items-center p-5 text-lg font-medium text-white xl:w-10/12">
              Check out all of {creator.person.name.split(' ')[0]}&apos;s work
            </div>
          </Square>
        </Link>
      </div>
    </div>
  );
}
