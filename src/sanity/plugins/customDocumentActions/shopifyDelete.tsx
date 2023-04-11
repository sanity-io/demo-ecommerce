import {useState} from 'react';
// @ts-expect-error incompatibility with node16 resolution
import {TrashIcon} from '@sanity/icons';
import {Stack, Text, useToast} from '@sanity/ui';
import {
  type DocumentActionDescription,
  type DocumentActionConfirmDialogProps,
  useClient,
  useWorkspace,
} from 'sanity';
import {useRouter} from 'sanity/router';
import type {ShopifyDocument, ShopifyDocumentActionProps} from './types';
import {SANITY_API_VERSION} from '../../constants';

export default (
  props: ShopifyDocumentActionProps,
): DocumentActionDescription | undefined => {
  const {
    draft,
    onComplete,
    type,
    published,
  }: {
    draft: ShopifyDocument;
    published: ShopifyDocument;
    type: string;
    onComplete: () => void;
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();
  const {basePath} = useWorkspace();
  const toast = useToast();
  const client = useClient({apiVersion: SANITY_API_VERSION});

  let dialog: DocumentActionConfirmDialogProps | null = null;

  if (type === 'product') {
    dialog = {
      message: (
        <Stack space={4}>
          <Text>
            Delete the current product and all associated variants in your
            dataset.
          </Text>
          <Text weight="medium">No content on Shopify will be deleted.</Text>
        </Stack>
      ),
      onCancel: onComplete,
      onConfirm: async () => {
        const productId = published?.store?.id;

        // Find product variant documents with matching Shopify Product ID
        let productVariantIds: string[] = [];
        if (productId) {
          productVariantIds = await client.fetch(
            `*[
                _type == "productVariant"
                && store.productId == $productId
              ]._id`,
            {productId},
          );
        }

        // Delete current document (including draft)
        const transaction = client.transaction();
        if (published?._id) {
          transaction.delete(published._id);
        }
        if (draft?._id) {
          transaction.delete(draft._id);
        }

        // Delete all product variants with matching IDs
        productVariantIds?.forEach((documentId) => {
          if (documentId) {
            transaction.delete(documentId);
            transaction.delete(`drafts.${documentId}`);
          }
        });

        try {
          await transaction.commit();
          // Navigate back to products root
          router.navigateUrl({path: `${basePath}/desk/products`});
        } catch (err) {
          let message = 'Unknown Error';
          if (err instanceof Error) message = err.message;

          toast.push({
            status: 'error',
            title: message,
          });
        } finally {
          // Signal that the action is complete
          onComplete();
        }
      },
      type: 'confirm',
    };
  }

  if (type === 'collection') {
    dialog = {
      message: (
        <Stack space={4}>
          <Text>Delete the current collection in your dataset.</Text>
          <Text weight="medium">No content on Shopify will be deleted.</Text>
        </Stack>
      ),
      onCancel: onComplete,
      onConfirm: async () => {
        // Delete current document (including draft)
        const transaction = client.transaction();
        if (published?._id) {
          transaction.delete(published._id);
        }
        if (draft?._id) {
          transaction.delete(draft._id);
        }

        try {
          await transaction.commit();
          // Navigate back to collections root
          router.navigateUrl({path: `${basePath}/desk/collections`});
        } catch (err) {
          let message = 'Unknown Error';
          if (err instanceof Error) message = err.message;

          toast.push({
            status: 'error',
            title: message,
          });
        } finally {
          // Signal that the action is complete
          onComplete();
        }
      },
      type: 'confirm',
    };
  }

  if (!dialog) {
    return;
  }

  return {
    tone: 'critical',
    dialog: dialogOpen && dialog,
    icon: TrashIcon,
    label: 'Delete',
    onHandle: () => setDialogOpen(true),
    shortcut: 'Ctrl+Alt+D',
  };
};
