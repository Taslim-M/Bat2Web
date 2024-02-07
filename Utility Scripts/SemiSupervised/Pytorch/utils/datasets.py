#!coding:utf-8
import numpy as np
import torchvision as tv
import torchvision.transforms as transforms
import torch
from sklearn.model_selection import train_test_split
from torch.utils.data import TensorDataset, DataLoader
from PIL import Image

import os


from utils.randAug import RandAugmentMC
from utils.data_utils import NO_LABEL
from utils.data_utils import TransformWeakStrong as wstwice

load = {}
def register_dataset(dataset):
    def warpper(f):
        load[dataset] = f
        return f
    return warpper

def encode_label(label):
    return NO_LABEL* (label +1)

def decode_label(label):
    return NO_LABEL * label -1

def split_relabel_data(np_labs, labels, label_per_class,
                        num_classes):
    """ Return the labeled indexes and unlabeled_indexes
    """
    labeled_idxs = []
    unlabed_idxs = []
    for id in range(num_classes):
        indexes = np.where(np_labs==id)[0]
        np.random.shuffle(indexes)
        labeled_idxs.extend(indexes[:label_per_class])
        unlabed_idxs.extend(indexes[label_per_class:])
    np.random.shuffle(labeled_idxs)
    np.random.shuffle(unlabed_idxs)
    ## relabel dataset
    for idx in unlabed_idxs:
        labels[idx] = encode_label(labels[idx])

    return labeled_idxs, unlabed_idxs
     

@register_dataset('cifar10')
def cifar10(n_labels, data_root='./data-local/cifar10/'):
    channel_stats = dict(mean = [0.4914, 0.4822, 0.4465],
                         std = [0.2023, 0.1994, 0.2010])
    train_transform = transforms.Compose([
        transforms.Pad(2, padding_mode='reflect'),
        transforms.ColorJitter(brightness=0.4, contrast=0.4,
                               saturation=0.4, hue=0.1),
        transforms.RandomCrop(32),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    eval_transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    trainset = tv.datasets.CIFAR10(data_root, train=True, download=True,
                                   transform=train_transform)
    evalset = tv.datasets.CIFAR10(data_root, train=False, download=True,
                                   transform=eval_transform)
    num_classes = 10
    label_per_class = n_labels // num_classes
    labeled_idxs, unlabed_idxs = split_relabel_data(
                                    np.array(trainset.train_labels),
                                    trainset.train_labels,
                                    label_per_class,
                                    num_classes)
    return {
        'trainset': trainset,
        'evalset': evalset,
        'label_idxs': labeled_idxs,
        'unlab_idxs': unlabed_idxs,
        'num_classes': num_classes
    }

@register_dataset('wscifar10')
def wscifar10(n_labels, data_root='./data-local/cifar10/'):
    channel_stats = dict(mean = [0.4914, 0.4822, 0.4465],
                         std = [0.2023, 0.1994, 0.2010])
    weak = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.Pad(2, padding_mode='reflect'),
        transforms.RandomCrop(32),
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    strong = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.Pad(2, padding_mode='reflect'),
        transforms.RandomCrop(32),
        RandAugmentMC(n=2, m=10),
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    train_transform = wstwice(weak, strong)
    eval_transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    trainset = tv.datasets.CIFAR10(data_root, train=True, download=True,
                                   transform=train_transform)
    evalset = tv.datasets.CIFAR10(data_root, train=False, download=True,
                                   transform=eval_transform)
    num_classes = 10
    label_per_class = n_labels // num_classes
    labeled_idxs, unlabed_idxs = split_relabel_data(
                                    np.array(trainset.train_labels),
                                    trainset.train_labels,
                                    label_per_class,
                                    num_classes)
    return {
        'trainset': trainset,
        'evalset': evalset,
        'label_idxs': labeled_idxs,
        'unlab_idxs': unlabed_idxs,
        'num_classes': num_classes
    }


@register_dataset('cifar100')
def cifar100(n_labels, data_root='./data-local/cifar100/'):
    channel_stats = dict(mean = [0.5071, 0.4867, 0.4408],
                         std = [0.2675, 0.2565, 0.2761])
    train_transform = transforms.Compose([
        transforms.Pad(2, padding_mode='reflect'),
        transforms.ColorJitter(brightness=0.4, contrast=0.4,
                               saturation=0.4, hue=0.1),
        transforms.RandomCrop(32),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    eval_transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(**channel_stats)
    ])
    trainset = tv.datasets.CIFAR100(data_root, train=True, download=True,
                                   transform=train_transform)
    evalset = tv.datasets.CIFAR100(data_root, train=False, download=True,
                                   transform=eval_transform)
    num_classes = 100
    label_per_class = n_labels // num_classes
    labeled_idxs, unlabed_idxs = split_relabel_data(
                                    np.array(trainset.train_labels),
                                    trainset.train_labels,
                                    label_per_class,
                                    num_classes)
    return {
        'trainset': trainset,
        'evalset': evalset,
        'labeled_idxs': labeled_idxs,
        'unlabeled_idxs': unlabed_idxs,
        'num_classes': num_classes
    }

def getSpeciesCode(x):
    part = x.split('_')
    if part[0] == 'ASETRI':
        return 0
    elif part[0] == 'EPTBOT':
        return 1
    elif part[0] == 'MYOEMA':
        return 2
    elif part[0] == 'PIPKUH':
        return 3
    elif part[0] == 'RHIMUS':
        return 4
    elif part[0] == 'RHYNAS':
        return 5
    elif part[0] == 'ROUAEG':
        return 6
    elif part[0] == 'TAPPER':
        return 7
    else:
        return 'Unknown'

@register_dataset('bat_data')
def bat_data(n_labels):
    X_all = []
    Y_all = []

    image_folder_path = '../../data/SpectogramInitial'
    file_paths = [f for f in os.listdir(image_folder_path)]

    for file_name in file_paths:
        spectrogram = Image.open(image_folder_path + '/' + file_name)   
        spectrogram = spectrogram.convert('RGB')
        spectrogram = spectrogram.resize((168, 112))  
        spectrogram = np.array(spectrogram)
        X_all.append(spectrogram)
        Y_all.append(getSpeciesCode(file_name))
    
    image_folder_path = '../../data/noise'
    file_paths = [f for f in os.listdir(image_folder_path)]

    for file_name in file_paths:
        spectrogram = Image.open(image_folder_path + '/' + file_name)
        spectrogram = spectrogram.convert('RGB')
        spectrogram = spectrogram.resize((168, 112))  
        spectrogram = np.array(spectrogram)
        X_all.append(spectrogram)
        Y_all.append(8)
        
    X_all = np.array(X_all)
    Y_all = np.array(Y_all)
    X_all = np.moveaxis(X_all, -1, 1) #For pytorch if RGB
    Y_all = Y_all.astype(int)

    X_train, X_test, Y_train, Y_test = train_test_split(X_all, Y_all, test_size=0.2, random_state = 245, stratify=Y_all)

    tensor_x_train = torch.from_numpy(X_train) # transform to torch tensor
    tensor_y_train = torch.from_numpy(Y_train)
    tensor_x_test =  torch.from_numpy(X_test) 
    tensor_y_test =  torch.from_numpy(Y_test)
    
    trainset  = TensorDataset(tensor_x_train,tensor_y_train) # create your datset
    evalset  = TensorDataset(tensor_x_test,tensor_y_test) # create your datset
    
    num_classes = 9
    label_per_class = n_labels // num_classes
    labeled_idxs, unlabed_idxs = split_relabel_data(
                                    Y_train,
                                    tensor_y_train,
                                    label_per_class,
                                    num_classes)
    return {
        'trainset': trainset,
        'evalset': evalset,
        'label_idxs': labeled_idxs,
        'unlab_idxs': unlabed_idxs,
        'num_classes': num_classes
    }