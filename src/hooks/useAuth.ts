import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorLocalStorageKey, ConnectorNames } from '../constants/wallet'
import { notification } from 'antd'
import { connectorsByName } from '../connectors'
import { updateErrorInfo } from '../state/wallet/actions'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

/* 连接和断开钱包连接 */
const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { activate, deactivate } = useWeb3React()

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error: Error) => {
        window.localStorage.removeItem(connectorLocalStorageKey)
        if (error instanceof UnsupportedChainIdError) {
          // error modal
          notification.error({
            message: t('Unsupported Chain Id'),
            description: t('Unsupported Chain Id Error. Check your chain Id'),
          })
          dispatch(updateErrorInfo({ hasError: true, errorInfo: 'Unsupported Chain Id' }))
        } else if (error instanceof NoEthereumProviderError) {
          notification.error({
            message: t('Provider Error'),
            description: t('No provider was found'),
          })
          dispatch(updateErrorInfo({ hasError: true, errorInfo: 'Provider Error' }))
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = null
          }
          notification.error({
            message: t('Authorization Error'),
            description: t('Please authorize to access your account'),
          })
          dispatch(updateErrorInfo({ hasError: true, errorInfo: 'Authorization Error' }))
        } else {
          notification.error({
            message: t(`Unkown Error`),
            description: t(`${error.message}`),
          })
          dispatch(updateErrorInfo({ hasError: true, errorInfo: t(`Unkown Error`) }))
        }
      })
    } else {
      notification.error({
        message: t("Can't find connector"),
        description: t('The connector config is wrong'),
      })
      dispatch(updateErrorInfo({ hasError: true, errorInfo: "Can't find connector" }))
    }
  }, [])

  return { login, logout: deactivate }
}

export default useAuth
